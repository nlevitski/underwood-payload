'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  sendContactAction,
  type ContactActionState,
} from './actions'

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const cooldownSeconds = 10
  const [cooldown, setCooldown] = useState(0)
  const [state, formAction, isPending] = useActionState<
    ContactActionState,
    FormData
  >(sendContactAction, {
    status: 'idle',
    message: '',
  })

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset()
      setCooldown(cooldownSeconds)
    }
  }, [state.status])

  useEffect(() => {
    if (cooldown <= 0) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setCooldown((current) => {
        if (current <= 1) {
          window.clearInterval(timer)
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [cooldown])

  return (
    <div className="bg-card rounded-xl p-8 shadow-soft">
      <h2 className="text-2xl font-bold text-foreground mb-2">Напишите нам</h2>
      <p className="text-muted-foreground mb-6">Задайте вопрос или уточните наличие растений</p>

      <form
        ref={formRef}
        action={formAction}
        onSubmit={(event) => {
          if (cooldown > 0 || isPending) {
            event.preventDefault()
            return
          }
        }}
        className="space-y-6"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-0">
            <Label htmlFor="name" className="mb-[14px] block font-normal">
              Имя *
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Ваше имя"
              minLength={2}
              maxLength={70}
              required
            />
          </div>

          <div className="space-y-0">
            <Label htmlFor="phone" className="mb-[14px] block font-normal">
              Телефон *
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+375... / +7..."
              maxLength={24}
              title="Введите номер Беларуси (+375...) или России (+7...)"
              required
            />
          </div>
        </div>

        <div className="space-y-0">
          <Label htmlFor="email" className="mb-[14px] block font-normal">
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="email@example.com"
            maxLength={254}
            required
          />
        </div>

        <div className="space-y-0">
          <Label htmlFor="message" className="mb-[14px] block font-normal">
            Сообщение *
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Опишите ваш вопрос или какие растения вас интересуют..."
            rows={5}
            minLength={10}
            maxLength={2000}
            required
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-11 rounded-md bg-forest text-primary-foreground hover:bg-forest/90 shadow-soft hover:shadow-card"
          disabled={isPending || cooldown > 0}
        >
          {isPending ? (
            'Отправка...'
          ) : cooldown > 0 ? (
            `Повторно через ${cooldown} сек.`
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Отправить сообщение
            </>
          )}
        </Button>

        {state.status !== 'idle' ? (
          <p
            className={
              state.status === 'success'
                ? 'rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900'
                : 'rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900'
            }
          >
            {state.message}
          </p>
        ) : null}

        {cooldown > 0 ? (
          <p className="text-sm text-muted-foreground">
            Повторная отправка будет доступна через {cooldown} сек.
          </p>
        ) : null}
      </form>
    </div>
  )
}
