import React from 'react';
import styled from 'styled-components';
import muiStyled from '@material-ui/styles/styled';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import IconButton from '@material-ui/core/IconButton';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import ArrowDropDown from '@material-ui/icons/KeyboardArrowDown';
import { ArronaxIcon } from '../ArronaxIcon';
import { Config } from '../../types';

const HeaderContainer = styled.div`
  width: 100%;
  height: 104px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  background: linear-gradient(
    -225deg,
    #bcfcff 0%,
    #9cd9e1 12.85%,
    #84bfca 22.66%,
    #75aebc 28.69%,
    #417895 48.65%,
    #395d94 85.37%,
    #34386e 100%
  );
`;
const HeaderLogo = styled.div`
  font-family: 'Futura';
  font-weight: 400;
  font-size: 36px;
  color: #fffffe;
  letter-spacing: 5.46px;
`;

const IconContainer = styled.div`
  width: 35px;
  height: 35px;
  background: #669fb1;
  border-radius: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
`;

const SelectContainer = styled.div`
  margin-left: 12px;
`;

const DownIcon = muiStyled(ArrowDropDown)({
  color: 'white',
  marginLeft: '10px'
});

const MenuHeaderItem = muiStyled(MenuItem)({
  color: '#9b9b9b',
  boxSizing: 'border-box',
  padding: '5px 25px',
  opacity: 1,
  fontSize: '16px'
});

const MainMenuItem = muiStyled(MenuItem)({
  '&[class*="selected"]': {
    backgroundColor: 'rgba(101,  200, 206, 0.13)'
  },
  '&:hover': {
    backgroundColor: 'rgba(101,  200, 206, 0.1)'
  }
});

const UncheckedIcon = muiStyled(RadioButtonUncheckedIcon)({
  fontSize: '18px'
});

const CheckedIcon = muiStyled(RadioButtonCheckedIcon)({
  fontSize: '18px',
  color: '#00c4dc'
});

const MenuBtn = muiStyled(Button)({
  height: '52px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
  fontWeight: 300,
  letterSpacing: '2.57px',
  cursor: 'pointer',
  color: '#fffffe',
  textTransform: 'capitalize'
});

const IconBtnWrapper = muiStyled(IconButton)({
  marginLeft: 'auto'
});

const AddButton = styled.div`
  cursor: pointer;
  border-radius: 9px;
  height: 42px;
  width: 158px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  background: rgb(86, 194, 217);
  margin: 10px auto 0 auto;
`;

const Divider = styled.div`
  width: 85%;
  height: 1px;
  background-color: #ccc;
  padding: 0 16px;
  margin: 0 auto;
`;

interface Props {
  selectedConfig: Config;
  configs: Config[];
  onChangeNetwork(config: Config): void;
  openModal(): void;
  onRemoveConfig(index: number): void;
}

const Header: React.FC<Props> = props => {
  const { selectedConfig, configs } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const localConfigs = [];
  const mainConfigs = [];
  configs.forEach(config => {
    if (config.isLocal) {
      localConfigs.push(config);
    } else {
      mainConfigs.push(config);
    }
  });

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function changeNetwork(config: Config) {
    const { onChangeNetwork } = props;
    onChangeNetwork(config);
    setAnchorEl(null);
  }

  function openConfigModal() {
    const { openModal } = props;
    setAnchorEl(null);
    openModal();
  }

  function removeConfig(event: any, index: number) {
    const { onRemoveConfig } = props;
    onRemoveConfig(index);
    setAnchorEl(null);
    event.stopPropagation();
  }

  return (
    <HeaderContainer>
      <HeaderLogo>ARRONAX beta</HeaderLogo>
      <IconContainer>
        <ArronaxIcon size="22px" color="#FFFFFF" iconName="icon-tz" />
      </IconContainer>
      <SelectContainer>
        <MenuBtn
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          {selectedConfig.displayName}
          <DownIcon />
        </MenuBtn>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuHeaderItem value="" disabled>
            Select Preferred Tezos Network
          </MenuHeaderItem>
          {mainConfigs.map(config => {
            const isSelected = selectedConfig.network === config.network && selectedConfig.platform === config.platform &&
              selectedConfig.url === config.url && selectedConfig.apiKey === config.apiKey;
            return (
              <MainMenuItem
                key={config.network}
                onClick={() => changeNetwork(config)}
              >
                <Radio
                  checked={isSelected}
                  icon={<UncheckedIcon fontSize="small" />}
                  checkedIcon={<CheckedIcon fontSize="small" />}
                />
                {config.displayName}
              </MainMenuItem>
            );
          })}
          {localConfigs.length > 0 && <Divider />}
          {localConfigs.map((config, index) => {
            const isSelected = selectedConfig.network === config.network && selectedConfig.platform === config.platform &&
              selectedConfig.url === config.url && selectedConfig.apiKey === config.apiKey;
            return (
              <MainMenuItem
                key={config.network}
                onClick={() => changeNetwork(config)}
              >
                <Radio
                  checked={isSelected}
                  icon={<UncheckedIcon fontSize="small" />}
                  checkedIcon={<CheckedIcon fontSize="small" />}
                />
                {config.displayName}
                {!isSelected && (
                  <IconBtnWrapper
                    aria-label="Delete"
                    disabled={isSelected}
                    onClick={(event) => removeConfig(event, mainConfigs.length + index)}
                  >
                    <ArronaxIcon size="37px" color="#d8d8d8" iconName="icon-delete" />
                  </IconBtnWrapper>
                )}                
              </MainMenuItem>
            );
          })}
          <AddButton onClick={openConfigModal}>Add Network</AddButton>
        </Menu>
      </SelectContainer>
    </HeaderContainer>
  );
};

export default Header;
