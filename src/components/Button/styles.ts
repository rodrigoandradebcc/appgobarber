import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

interface ButtonProps {
  isCancelButton?: boolean;
}

export const Container = styled(RectButton)<ButtonProps>`
  /* width: 100%; */

  height: 60px;
  border-radius: 10px;
  margin-top: 8px;
  /* background: #ff9000; */
  background: ${props => (props.isCancelButton ? '#c53030' : '#ff9000')};

  justify-content: center;
  align-items: center;

  /* ${props =>
    props.isCancelButton &&
    css`
      background: #c53030;
    `} */
`;

export const ButtonText = styled.Text<ButtonProps>`
  font-family: 'RobotoSlab-Medium';

  color: ${props => (props.isCancelButton ? '#f4ede8' : '#312e38')};

  font-size: 15px;
`;
