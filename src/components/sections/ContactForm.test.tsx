import { render, screen } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ContactFormValues } from '../../types/contact'
import { ContactForm } from './ContactForm'

// The brief fixes this wording exactly, so the test pins the literal text rather than importing it.
const SUCCESS_MESSAGE = 'Thanks! Our team will contact you shortly.'
const VALID_MESSAGE = 'We would like a demo of the automation features for our team.'

async function fillValidForm(user: UserEvent, teamSize = '11-50') {
  await user.type(screen.getByLabelText(/full name/i), 'Sarah Connor')
  await user.type(screen.getByLabelText(/work email/i), 'sarah@company.com')
  await user.type(screen.getByLabelText(/company name/i), 'Acme Studio')
  await user.selectOptions(screen.getByLabelText(/team size/i), teamSize)
  await user.type(screen.getByLabelText(/message/i), VALID_MESSAGE)
  await user.click(screen.getByLabelText(/i agree to the terms/i))
}

function setup(onSubmitRequest = vi.fn(async (_values: ContactFormValues) => {})) {
  const user = userEvent.setup()
  render(<ContactForm onSubmitRequest={onSubmitRequest} />)
  return { user, onSubmitRequest }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('ContactForm', () => {
  it('does not submit an invalid form and explains every problem next to its field', async () => {
    const { user, onSubmitRequest } = setup()

    await user.click(screen.getByRole('button', { name: 'Send Message' }))

    expect(onSubmitRequest).not.toHaveBeenCalled()
    expect(screen.getByLabelText(/full name/i)).toHaveAccessibleDescription(/at least 3 characters/i)
    expect(screen.getByLabelText(/work email/i)).toHaveAccessibleDescription(/enter your work email/i)
    expect(screen.getByLabelText(/company name/i)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(/team size/i)).toHaveAccessibleDescription(/select your team size/i)
    expect(screen.getByLabelText(/message/i)).toHaveAccessibleDescription(/enter a message/i)
    expect(screen.getByLabelText(/i agree to the terms/i)).toHaveAccessibleDescription(/accept the terms/i)
    expect(screen.getByLabelText(/full name/i)).toHaveFocus()
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('aria-required', 'true')
  })

  it('rejects short names, malformed emails and messages under 20 characters', async () => {
    const { user, onSubmitRequest } = setup()
    await fillValidForm(user)
    await user.clear(screen.getByLabelText(/full name/i))
    await user.type(screen.getByLabelText(/full name/i), 'Al')
    await user.clear(screen.getByLabelText(/work email/i))
    await user.type(screen.getByLabelText(/work email/i), 'sarah@company')
    await user.clear(screen.getByLabelText(/message/i))
    await user.type(screen.getByLabelText(/message/i), 'Too short')

    await user.click(screen.getByRole('button', { name: 'Send Message' }))

    expect(onSubmitRequest).not.toHaveBeenCalled()
    expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument()
    expect(screen.getByText(/valid email address/i)).toBeInTheDocument()
    expect(screen.getByText(/at least 20 characters/i)).toBeInTheDocument()
  })

  it('counts message characters live', async () => {
    const { user } = setup()
    expect(screen.getByText('0 / 300')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/message/i), 'Hello')

    expect(screen.getByText('5 / 300')).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toHaveAccessibleDescription('5 / 300')
  })

  it('shows Preferred Demo Time for 200+ teams and requires it', async () => {
    const { user, onSubmitRequest } = setup()
    expect(screen.queryByLabelText(/preferred demo time/i)).not.toBeInTheDocument()

    await fillValidForm(user, '200+')
    const demoTime = screen.getByLabelText(/preferred demo time/i)
    expect(screen.getAllByRole('option', { name: /morning|afternoon|evening/i })).toHaveLength(3)

    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    expect(onSubmitRequest).not.toHaveBeenCalled()
    expect(demoTime).toHaveAccessibleDescription(/choose a preferred demo time/i)

    await user.selectOptions(demoTime, 'afternoon')
    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    expect(onSubmitRequest).toHaveBeenCalledTimes(1)
    expect(onSubmitRequest.mock.calls[0][0]).toMatchObject({ teamSize: '200+', demoTime: 'afternoon' })
  })

  it('removes Preferred Demo Time when the team size changes, so it no longer blocks submission', async () => {
    const { user, onSubmitRequest } = setup()
    await fillValidForm(user, '200+')
    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    expect(onSubmitRequest).not.toHaveBeenCalled()

    await user.selectOptions(screen.getByLabelText(/team size/i), '51-200')
    expect(screen.queryByLabelText(/preferred demo time/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    expect(onSubmitRequest).toHaveBeenCalledTimes(1)
    expect(onSubmitRequest.mock.calls[0][0]).not.toHaveProperty('demoTime')
  })

  it('disables the button while sending, ignores repeated submits, then shows the success message', async () => {
    let finishRequest = () => {}
    const onSubmitRequest = vi.fn(
      (_values: ContactFormValues) =>
        new Promise<void>((resolve) => {
          finishRequest = resolve
        }),
    )
    const { user } = setup(onSubmitRequest)
    await fillValidForm(user)

    await user.dblClick(screen.getByRole('button', { name: 'Send Message' }))
    await user.type(screen.getByLabelText(/company name/i), '{Enter}')

    const sending = screen.getByRole('button', { name: 'Sending…' })
    expect(sending).toBeDisabled()
    expect(onSubmitRequest).toHaveBeenCalledTimes(1)

    finishRequest()

    expect(await screen.findByRole('status')).toHaveTextContent(SUCCESS_MESSAGE)
    expect(screen.queryByRole('form')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Send another message' }))
    expect(screen.getByLabelText(/full name/i)).toHaveValue('')
    expect(screen.getByLabelText(/full name/i)).toHaveFocus()
  })

  it('waits about a second with the default simulated request before confirming', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ContactForm />)
    await fillValidForm(user)

    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled()
    await vi.advanceTimersByTimeAsync(900)
    expect(screen.queryByText(SUCCESS_MESSAGE)).not.toBeInTheDocument()

    await vi.advanceTimersByTimeAsync(200)
    expect(await screen.findByText(SUCCESS_MESSAGE)).toBeInTheDocument()
  })
})
