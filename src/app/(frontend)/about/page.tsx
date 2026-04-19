import { AboutCTA } from '../_components/aboutPage/AboutCTA'
import { AboutHero } from '../_components/aboutPage/AboutHero'
import { AboutStats } from '../_components/aboutPage/AboutStats'
import { AboutStory } from '../_components/aboutPage/AboutStory'
import { AboutValues } from '../_components/aboutPage/AboutValues'

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStats />
      <AboutStory />
      <AboutValues />
      <AboutCTA />
    </>
  )
}
