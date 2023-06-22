import Image from 'next/image'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { HomeContainer, Product, SliderContainer } from '../styles/pages/home'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import useEmblaCarousel from 'embla-carousel-react'
import { CartButton } from '@/components/CartButton'
import { useCart } from '@/hooks/useCart'
import { IProduct } from '@/contexts/CartContext'
import { MouseEvent, useEffect, useState } from 'react'
import { ProductSkeleton } from '@/components/ProductSkeleton'

interface HomeProps {
  products: IProduct[]
}

export default function Home({ products }: HomeProps) {
  const [isLoading, setIsLoading] = useState(true)

  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    skipSnaps: false,
    dragFree: true,
  })

  useEffect(() => {
    // just a fake loading to use skeleton animations
    const timeOut = setTimeout(() => setIsLoading(false), 2000)

    return () => clearTimeout(timeOut)
  }, [])

  const { addToCart, checkIfItemAlreadyExists } = useCart()

  function handleAddToCart(
    e: MouseEvent<HTMLButtonElement>,
    product: IProduct,
  ) {
    e.preventDefault()
    addToCart(product)
  }

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>

      <div style={{ overflow: 'hidden', width: '100%' }}>
        <HomeContainer>
          <div className="embla" ref={emblaRef}>
            <SliderContainer className="embla__container container">
              {isLoading ? (
                <>
                  <ProductSkeleton className="embla__slide" />
                  <ProductSkeleton className="embla__slide" />
                  <ProductSkeleton className="embla__slide" />
                </>
              ) : (
                <>
                  {products.map((product) => {
                    return (
                      <Product
                        className="embla__slide"
                        key={product.id}
                        href={`/product/${product.id}`}
                      >
                        <Image
                          src={product.imageUrl}
                          width={520}
                          height={480}
                          alt=""
                        />
                        <footer>
                          <div>
                            <strong> {product.name}</strong>
                            <span>{product.price}</span>
                          </div>
                          <CartButton
                            color="green"
                            size="large"
                            title={
                              checkIfItemAlreadyExists(product.id)
                                ? 'Produto já está no carrinho'
                                : 'Adicionar no carrinho'
                            }
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={checkIfItemAlreadyExists(product.id)}
                          />
                        </footer>
                      </Product>
                    )
                  })}{' '}
                </>
              )}
            </SliderContainer>
          </div>
        </HomeContainer>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price'],
  })

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price.unit_amount! / 100),
      numberPrice: price.unit_amount! / 100,
      defaultPriceId: price.id,
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2 hours
  }
}
