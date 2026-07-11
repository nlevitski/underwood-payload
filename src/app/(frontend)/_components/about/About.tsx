import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import * as motion from 'motion/react-client'
import { getMediaImageByFilename } from '@/collections/Media/fetchers'
import { getPayloadClient } from '@/lib/payload/client'

const nurseryImageFilename = 'nursery_perspective_IMG_4676.webp'
const nurseryImageSrc = `/api/media/file/${nurseryImageFilename}`

export async function About() {
  const payload = await getPayloadClient()
  const nurseryImage = await getMediaImageByFilename(payload, nurseryImageFilename)

  return (
    <section className="py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-medium text-forest uppercase tracking-wide">
              О питомнике
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
              Выращиваем с 2016 года
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Питомник Underwood вырос из простой любви к растениям. Всё началось с туй,
                высаженных у собственного дома в качестве живой изгороди, затем появились кусты
                голубики — и это увлечение переросло в настоящее дело.
              </p>
              {/* <p>
                Каждое растение проходит полный цикл выращивания в наших условиях, что гарантирует
                отличную приживаемость и здоровье саженцев.
              </p> */}
            </div>
            <Button variant="outline" asChild className="mt-6">
              <Link href="/about">
                Узнать больше о нас
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-elevated">
              <Image
                src={nurseryImage?.src ?? nurseryImageSrc}
                alt="Общий вид питомника Underwood"
                fill
                placeholder={nurseryImage?.blurDataUrl ? 'blur' : 'empty'}
                blurDataURL={nurseryImage?.blurDataUrl}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
