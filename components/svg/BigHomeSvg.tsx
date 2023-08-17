interface Props {
  color?: string
  className?: string
}

export default function BigHomeSvg(props: Props) {
  return (
    <svg className={props.className} width="367" height="319" viewBox="0 0 367 319" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_3107_29565"  maskUnits="userSpaceOnUse" x="0" y="0" width="367" height="319">
      <path d="M188.111 0H180.876H178.465L0 84.4089V96.4673L9.64673 110.937L16.8818 115.761L31.3519 110.937V313.519L33.7636 318.342H236.345H330.401H332.812L335.224 313.519V110.937L347.282 115.761H352.106L366.576 96.4673V86.8206L364.164 84.4089V81.9972L188.111 0Z" fill="#D9D9D9"/>
      </mask>
      <g mask="url(#mask0_3107_29565)">
      <rect x="-4.82422" y="-7.23584" width="381.046" height="337.636" fill="#F3CE7B"/>
      </g>
    </svg>
  )
}

