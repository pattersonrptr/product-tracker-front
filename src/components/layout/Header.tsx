/**
 * Top navigation bar.
 */

import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useAuth } from '@/context/AuthContext'

interface HeaderProps {
  onMenuClick: () => void
  sidebarOpen: boolean
}

export function Header({ onMenuClick }: HeaderProps) {
  const { logout } = useAuth()

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
          aria-label="toggle sidebar"
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Product Tracker
        </Typography>

        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}
