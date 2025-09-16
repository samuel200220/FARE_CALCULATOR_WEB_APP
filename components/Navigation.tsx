import Link from 'next/link'
import type { Locale } from '../lib/i18n'

type Props = {
  locale: Locale
  dict: any
}

export default function Navigation({ locale, dict }: Props) {
  return (
    <nav>
      <Link href={`/${locale}`}>
        {dict.navigation.home}
      </Link>
      <Link href={`/${locale}/about`}>
        {dict.navigation.about}
      </Link>
    </nav>
  )
}