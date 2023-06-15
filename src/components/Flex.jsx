import { styled } from "styled-components";

export const Flex = styled.div`
  display: flex;
  align-items: ${(props) => props.alignitems};
  flex: ${(props) => props.flex};
  justify-content: ${(props) => props.justify};
`;
