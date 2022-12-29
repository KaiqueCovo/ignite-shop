import Image from "next/image"
import logoImg from "@/assets/logo.svg";
import { Container } from "./styles";

export function Header() {
  return (
    <Container>
      <Image src={logoImg} alt="Logo" />
    </Container>
  );
}
