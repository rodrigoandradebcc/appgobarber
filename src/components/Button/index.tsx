import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler';
import { CSSProp } from 'styled-components';
import { Container, ButtonText } from './styles';

interface ButtonProps extends RectButtonProperties {
  children: string;
  isCancelButton?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  isCancelButton = false,
  children,
  ...rest
}) => {
  console.log('Button', isCancelButton);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Container isCancelButton={isCancelButton} {...rest}>
      <ButtonText isCancelButton={isCancelButton}>{children}</ButtonText>
    </Container>
  );
};

export default Button;
