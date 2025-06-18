import { InputHTMLAttributes, forwardRef } from "react";

// InputHTMLAttributes : Gives al valid props that <input> supports
// forwardRef          : lets you pass ref to child components

// React Hook Forms can control the <input> with ref

const LabelledInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ placeholder, type, ...rest }, ref) => (
  <div className="flex flex-col justify-start">
    <input
      ref={ref} // forwards the ref from react-hook-form
      {...rest} // spreads all extra props
      type={type}
      placeholder={placeholder}
    />
  </div>
));

export default LabelledInput;
