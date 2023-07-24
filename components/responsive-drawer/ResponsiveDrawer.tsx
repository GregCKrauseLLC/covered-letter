"use client";

// Third party
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MenuIcon from "@mui/icons-material/Menu";
import React, { ReactElement } from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

// Local
import styles from "./ResponsiveDrawer.module.css";

const drawerWidth = 240;

export default function ResponsiveDrawer({
  currentTab,
  children,
}: {
  currentTab: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  type link = {
    location: string;
    icon: ReactElement;
  };

  type links = {
    "Cover Letter Generator": link;
  };

  const links: links = {
    "Cover Letter Generator": {
      location: "/cover-letter-generator",
      icon: <MarkEmailReadIcon />,
    },
  };

  const dividers: number[] = []; // The indices after which dividers should be placed

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {Object.keys(links).map((text, index) => (
          <div key={text}>
            <ListItem disablePadding>
              <Link
                href={links[text as keyof links].location}
                className={styles["menu-link"]}
              >
                <ListItemButton selected={text === currentTab}>
                  <ListItemIcon>{links[text as keyof links].icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </Link>
            </ListItem>
            {dividers.includes(index) ? <Divider /> : <></>}
          </div>
        ))}
      </List>
    </div>
  );

  return (
    <Box className={styles["responsive-drawer"]}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            CoveredLetter
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        className={styles.main}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
