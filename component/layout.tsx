import { FC, ReactNode } from "react";
import Header from "./header";
interface Props {
  children: ReactNode;
}
const Layout: FC<Props> = (props: Props) => {
  const { children } = props;
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
