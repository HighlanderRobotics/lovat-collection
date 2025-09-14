import { KeyboardTypeOptions } from "react-native";
import { colors } from "../colors";
import { TextInput } from "react-native";
import { forwardRef, ForwardRefRenderFunction, useState } from "react";

type TextInputProps = {
  density?: "comfortable" | "compact";
  placeholder?: string;
  autoFocus?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  editable?: boolean;
  error?: boolean;
  value?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};

const TextField: ForwardRefRenderFunction<TextInput, TextInputProps> = (
  {
    density = "comfortable",
    placeholder = "",
    autoFocus,
    autoCapitalize,
    autoCorrect,
    returnKeyType,
    onChangeText,
    onSubmitEditing,
    editable = true,
    error,
    value,
    keyboardType,
    multiline,
    onFocus,
    onBlur,
  },
  ref,
) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      style={{
        fontFamily: "Heebo_400Regular",
        fontSize: density === "comfortable" ? 16 : 14,
        lineHeight: density === "comfortable" ? 23.5 : 20.56,
        color: editable ? colors.onBackground.default : "#535353",
        backgroundColor: editable
          ? colors.secondaryContainer.default
          : "#252525",
        borderRadius: 7,
        paddingVertical: density === "comfortable" ? 10 : 6,
        textAlignVertical: "center",
        paddingHorizontal: density === "comfortable" ? 14 : 10,
        borderWidth: 2,
        borderColor: error
          ? colors.danger.default
          : editable
            ? isFocused
              ? colors.gray.hover
              : colors.gray.default
            : "#2F2F2F",
      }}
      placeholder={placeholder}
      placeholderTextColor={editable ? "#626262" : "#3D3D3D"}
      autoFocus={autoFocus}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      returnKeyType={returnKeyType}
      keyboardType={keyboardType}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      editable={editable}
      ref={ref}
      onFocus={() => {
        setIsFocused(true);
        if (onFocus) onFocus();
      }}
      onBlur={() => {
        setIsFocused(false);
        if (onBlur) onBlur();
      }}
      blurOnSubmit={true}
      value={value}
      multiline={multiline}
    />
  );
};

export default forwardRef(TextField);
