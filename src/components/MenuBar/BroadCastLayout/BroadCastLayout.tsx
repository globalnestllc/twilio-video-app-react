import React, { useState, useRef } from 'react';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuContainer from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import { Theme, useMediaQuery } from '@material-ui/core';

export default function BroadCastLayout(props: { buttonClassName?: string }) {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [menuOpen, setMenuOpen] = useState(false);

  const anchorRef = useRef<HTMLButtonElement>(null);

  const layoutOptions = [
    { id: 1, itemkey: 'bestFit', name: 'Best Fit' },
    { id: 2, itemkey: 'verticalPresentation', name: 'Vertical Presentation' },
    { id: 3, itemkey: 'horizontalPresentation', name: 'Horizontal Presentation' },
  ];

  return (
    <>
      <Button onClick={() => setMenuOpen(isOpen => !isOpen)} ref={anchorRef} className={props.buttonClassName}>
        {isMobile ? (
          <MoreIcon />
        ) : (
          <>
            Layout
            <ExpandMoreIcon />
          </>
        )}
      </Button>
      <MenuContainer
        open={menuOpen}
        onClose={() => setMenuOpen(isOpen => !isOpen)}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: isMobile ? -55 : 'bottom',
          horizontal: 'center',
        }}
      >
        {layoutOptions.map(item => {
          return (
            <MenuItem key={item.id}>
              <Typography variant="body1">{item.name}</Typography>
            </MenuItem>
          );
        })}
      </MenuContainer>
    </>
  );
}

//onClick={() => setAboutOpen(true)}
