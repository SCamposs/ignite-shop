// EU CONSIDERO QUE CHEGUEI NUMA SOLUÇÃO MEIO RUIM MAS TUDO BEM
// SE VOCÊ LEU ISSO ME DIZ SE É RUIM OU NÃO E SE MELHORARIA ALGO, POR FAVOR

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
