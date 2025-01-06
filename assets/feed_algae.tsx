import * as React from "react";
import Svg, { SvgProps, Mask, Rect, G, Path } from "react-native-svg";
const FeedAlgae = (props: SvgProps) => (
  <Svg width={40} height={40} viewBox="0 0 40 40" fill="none" {...props}>
    <Mask
      id="mask0_4092_124"
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={40}
      height={40}
    >
      <Rect width={40} height={40} fill="#D9D9D9" />
    </Mask>
    <G mask="url(#mask0_4092_124)">
      <Path
        d="M8.06219 35.4019C6.63547 35.4019 5.42276 34.9022 4.42407 33.9028C3.42534 32.9034 2.92598 31.6898 2.92598 30.2621C2.92598 28.8343 3.42534 27.6186 4.42407 26.6147C5.42276 25.6109 6.63547 25.109 8.06219 25.109H31.9934C33.4258 25.109 34.6433 25.6103 35.646 26.613C36.6487 27.6157 37.1501 28.8333 37.1501 30.2657C37.1501 31.6962 36.6487 32.9099 35.646 33.9067C34.6433 34.9035 33.4258 35.4019 31.9934 35.4019H8.06219ZM8.06219 32.4641H31.9934C32.6221 32.4641 33.149 32.2531 33.5743 31.8311C33.9996 31.4091 34.2123 30.8862 34.2123 30.2624C34.2123 29.6386 33.9996 29.1134 33.5743 28.6868C33.149 28.2601 32.6221 28.0468 31.9934 28.0468H8.06219C7.4393 28.0468 6.91718 28.2592 6.49582 28.6839C6.07446 29.1087 5.86378 29.635 5.86378 30.2629C5.86378 30.8908 6.07446 31.4146 6.49582 31.8344C6.91718 32.2542 7.4393 32.4641 8.06219 32.4641ZM4.32323 18.1407C3.90976 18.1407 3.56426 18.0005 3.28673 17.7201C3.00923 17.4397 2.87048 17.0936 2.87048 16.6818C2.87048 16.2699 3.01025 15.9236 3.28978 15.6427C3.56933 15.3618 3.91446 15.2213 4.32515 15.2213H11.6301C12.0413 15.2213 12.3882 15.3626 12.6708 15.6452C12.9535 15.9277 13.0948 16.2745 13.0948 16.6855C13.0948 17.0991 12.9535 17.445 12.6708 17.7233C12.3882 18.0016 12.0413 18.1407 11.6301 18.1407H4.32323ZM7.71403 12.6902C7.29555 12.6902 6.94848 12.5486 6.67282 12.2655C6.39715 11.9824 6.25932 11.635 6.25932 11.2234C6.25932 10.8118 6.40053 10.4644 6.68294 10.1812C6.96536 9.89795 7.31025 9.75633 7.71761 9.75633H10.8494C11.2628 9.75633 11.6108 9.89764 11.8933 10.1802C12.1758 10.4629 12.317 10.8106 12.317 11.2235C12.317 11.6415 12.1756 11.9905 11.8927 12.2704C11.6098 12.5503 11.2617 12.6902 10.8484 12.6902H7.71403Z"
        fill={props.color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.5 19C26.5376 19 29 16.5376 29 13.5C29 10.4624 26.5376 8 23.5 8C20.4624 8 18 10.4624 18 13.5C18 16.5376 20.4624 19 23.5 19ZM23.5 22C28.1944 22 32 18.1944 32 13.5C32 8.80558 28.1944 5 23.5 5C18.8056 5 15 8.80558 15 13.5C15 18.1944 18.8056 22 23.5 22Z"
        fill={props.color}
      />
    </G>
  </Svg>
);
export default FeedAlgae;
