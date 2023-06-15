import { styled } from "styled-components";

export const Image = styled.img`
  border-radius: ${(props) => props.borderradius};
  margin: ${(props) => props.margin};
  flex: ${(props) => props.flex};
  @media (max-width: 480px) {
    display: none;
  }
`;
