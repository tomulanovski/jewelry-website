import * as React from 'react';
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';
import { brand } from '../theme';

const QuantityInput = React.forwardRef(function CustomNumberInput(props, ref) {
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: '+',
        },
        decrementButton: {
          children: '−',
        },
      }}
      {...props}
      ref={ref}
    />
  );
});

// Layout: [ − ] [ value ] [ + ]
const StyledInputRoot = styled('div')`
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  height: 100%;
  min-height: 46px;
  width: 100%;
  border: 1px solid ${brand.line};
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  transition: border-color 0.2s ease;

  &.${numberInputClasses.focused}, &:hover {
    border-color: ${brand.gold};
  }
`;

const StyledInputElement = styled('input')`
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
  font-size: 0.95rem;
  font-family: inherit;
  color: ${brand.text};
  background: transparent;
  border: none;
  outline: 0;
  text-align: center;
`;

const StyledButton = styled('button')`
  grid-row: 1;
  appearance: none;
  padding: 0;
  font-size: 1.1rem;
  line-height: 1;
  color: ${brand.goldSoft};
  background: transparent;
  border: 0;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${brand.gold};
  }

  &:disabled {
    color: ${brand.muted};
    opacity: 0.4;
    cursor: default;
  }

  &.${numberInputClasses.decrementButton} {
    grid-column: 1;
  }

  &.${numberInputClasses.incrementButton} {
    grid-column: 3;
  }
`;

export default QuantityInput;
