import { useEffect, useState, useMemo } from 'react'
import type { CartItem } from 'types/cartItem'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ShoppingCartIcon, SearchIcon } from '@heroicons/react/solid'
import Menu from 'components/Menu/Menu'
import SignOutButton from 'components/SignOutButton'
import { useSignedIn } from 'hooks/useSignedIn'

const Navigation = ({
  cart,
  emptyCart,
}: {
  cart: CartItem[]
  emptyCart: () => void
}) => {
  const totalQuantity = useMemo(
    () =>
      cart.reduce(
        (previousQuantity, cartItem) => previousQuantity + cartItem.quantity,
        0
      ),
    [cart]
  )
  const { pathname } = useRouter()
  const isNotCartPage = pathname !== '/cart'
  const cartExists = cart.length > 0

  // This is the code to fix this issue (https://github.com/vercel/next.js/discussions/35773).
  const [isSSR, setIsSSR] = useState(true)
  useEffect(() => setIsSSR(false), [])

  const showCartButton = isNotCartPage && cartExists && !isSSR
  const { signedIn, loading } = useSignedIn()

  return (
    <nav className='top-0 z-10 bg-white py-4 dark:bg-gray-900 md:sticky'>
      <div className='mx-auto flex max-w-4xl flex-wrap items-center gap-x-8 gap-y-2'>
        <Menu />
        <Link href='/'>
          <a className='text-4xl md:text-5xl font-logo'>SML Eats</a>
        </Link>
        <Link href='/search'>
          <a aria-label='Search'>
            <SearchIcon />
          </a>
        </Link>
        {showCartButton && (
          <Link href='/cart'>
            <a className='fixed right-5 left-5 bottom-5 z-10 flex items-center justify-center gap-x-2 md:static button'>
              <ShoppingCartIcon />
              <span>Cart • {totalQuantity}</span>
            </a>
          </Link>
        )}
        {!signedIn && !loading && (
          <>
            <Link href='/signup'>
              <a>Sign up</a>
            </Link>
            <Link href='/signin'>
              <a>Sign in</a>
            </Link>
          </>
        )}
        <SignOutButton emptyCart={emptyCart} />
      </div>
    </nav>
  )
}

export default Navigation
