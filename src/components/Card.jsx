import { styled } from "styled-components";
import { IconButton } from "./IconButton";

export const Card = styled.div`
  padding: 1rem 1.5rem;
  background-color: ${(props) => props.bgcolor};
  color: ${(props) => props.color};
  border-radius: 1rem;
  max-width: 480px;
  margin-top: 0.5rem;
`;
