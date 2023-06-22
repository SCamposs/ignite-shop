import React, { forwardRef, ComponentProps } from 'react'
import { Handbag } from 'phosphor-react'
import { CartButtonContainer } from './styles'

type CartButtonProps = ComponentProps<typeof CartButtonContainer>

export const CartButton = forwardRef<HTMLButtonElement, CartButtonProps>(
  function CartButton({ ...rest }, ref) {
    return (
      <CartButtonContainer ref={ref} {...rest}>
        <Handbag weight="bold" />
      </CartButtonContainer>
    )
  },
)
