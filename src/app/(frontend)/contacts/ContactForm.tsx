'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import { Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const form = event.currentTarget

    window.setTimeout(() => {
      setIsSubmitting(false)
      form.reset()
    }, 1000)
  }

  return (
    <div className="bg-card rounded-xl p-8 shadow-soft">
      <h2 className="text-2xl font-bold text-foreground mb-2">Напишите нам</h2>
      <p className="text-muted-foreground mb-6">Задайте вопрос или уточните наличие растений</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-0">
            <Label htmlFor="name" className="mb-[14px] block font-normal">
              Имя *
            </Label>
            <Input id="name" name="name" placeholder="Ваше имя" required />
          </div>

          <div className="space-y-0">
            <Label htmlFor="phone" className="mb-[14px] block font-normal">
              Телефон *
            </Label>
            <Input id="phone" name="phone" type="tel" placeholder="+375..." required />
          </div>
        </div>

        <div className="space-y-0">
          <Label htmlFor="email" className="mb-[14px] block font-normal">
            Email
          </Label>
          <Input id="email" name="email" type="email" placeholder="email@example.com" />
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
            required
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-11 rounded-md bg-forest text-primary-foreground hover:bg-forest/90 shadow-soft hover:shadow-card"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            'Отправка...'
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Отправить сообщение
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
