import React from "react"

type IconType = {
  height?: string
  width?: string
  fill?: string
}

export const o360 = ({
  height = "24px",
  width = "24px",
  fill = "#000",
}: IconType) => (
  <svg
    height={height}
    width={width}
    fill={fill}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M12 7C6.48 7 2 9.24 2 12C2 14.24 4.94 16.13 9 16.77V20L13 16L9 12V14.73C5.85 14.17 4 12.83 4 12C4 10.94 7.04 9 12 9C16.96 9 20 10.94 20 12C20 12.73 18.54 13.89 16 14.53V16.58C19.53 15.81 22 14.05 22 12C22 9.24 17.52 7 12 7Z" />
  </svg>
)
