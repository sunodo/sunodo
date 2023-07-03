import { FC } from "react";
import { AppShell } from "@mantine/core";
import Header from "./header";
import Footer from "./footer";
import Navbar from "./navbar";

const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AppShell
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={<Navbar />}
            footer={<Footer />}
            header={<Header />}
        >
            {children}
        </AppShell>
    );
};

export default Layout;
