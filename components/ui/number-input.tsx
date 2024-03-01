import * as React from "react";
import { useLocale, useNumberField } from "react-aria";
import { useNumberFieldState } from "react-stately";
import { Input } from "@/components/ui/input";
import type { AriaNumberFieldProps } from "react-aria";

export interface NumberInputProps extends AriaNumberFieldProps {
  className?: string;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => {
    let { locale } = useLocale();
    let state = useNumberFieldState({ ...props, locale });
    const internalRef = React.useRef<HTMLInputElement>(null);
    let { inputProps } = useNumberField(props, state, internalRef);

    React.useImperativeHandle(
      ref,
      () => internalRef.current as HTMLInputElement
    );

    return (
      <Input
        ref={internalRef}
        type="number"
        {...inputProps}
        className={props.className}
      />
    );
  }
);
NumberInput.displayName = "NumberInput";
