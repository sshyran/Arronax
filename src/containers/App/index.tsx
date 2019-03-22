import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  getAttributes,
  getLoading,
  getNetwork,
  getEntity,
  getItems,
  getColumns,
  getSelectedValues,
  getSelectedFilters,
} from '../../reducers/app/selectors';
import {
  changeNetwork,
  fetchItemsAction,
  submitQuery,
} from '../../reducers/app/thunks';
import {
  setSelectedValuesAction,
  setTabAction,
  removeValueAction,
  removeAllFiltersAction,
} from '../../reducers/app/actions';
import Header from 'components/Header';
import FilterTool from 'components/FilterTool';
import SettingsPanel from 'components/SettingsPanel';
import Footer from 'components/Footer';
import CustomTable from '../CustomTable';

const Container = styled.div`
  padding: 50px 0;
  min-height: calc(100vh - 405px);
`;

const MainContainer = styled.div`
  position: relative;
  min-height: 100vh;
`;

const LoadingContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  opacity: ${({ isDark }) => (isDark ? 0.74 : 1)};
  padding: 25px 30px 0 30px;
`;

const TabsWrapper = styled(Tabs)`
  &&& {
    padding: 0 30px;
    width: 100%;
    span[class*='MuiPrivateTabIndicator-root'] {
      background-color: #a6dfe2;
      height: 5px;
    }
  }
`;

const TabContainer = styled.div`
  padding: 0px 30px;
  position: relative;
  width: 100%;
`;

const TabItem = styled.div`
  color: #2e3b6c;
  font-size: 24px;
  letter-spacing: 3px;
  font-weight: ${({ isSelected }) => (isSelected ? 'normal' : 300)};
  margin-right: 133px;
  margin-bottom: 7px;
  cursor: pointer;
`;

const FilterExTxt = styled.span`
  font-size: 18px;
  color: #9b9b9b;
  margin-left: 21px;
`;

const tabsArray = [
  {
    value: 'blocks',
    title: 'Blocks',
  },
  {
    value: 'operations',
    title: 'Operations',
  },
  {
    value: 'accounts',
    title: 'Accounts',
  },
];

export interface Props {
  isLoading: boolean;
  network: string;
  selectedValues: object[];
  selectedEntity: string;
  items: object[];
  attributes: object[];
  selectedColumns: any[];
  selectedFilters: object[];
  removeValue: (value: object) => void;
  removeAllFilters: (entity: string) => void;
  changeNetwork(network: string): void;
  changeTab: (type: string) => void;
  fetchItems: (type: string) => void;
  setSelectedValues: (type: object[]) => void;
  submitQuery: () => void;
}

export interface States {
  isFilterCollapse: boolean;
  filterInputVal: any[];
  filterInputState: any;
}

class Arronax extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isFilterCollapse: false,
      filterInputVal: [],
      filterInputState: [],
    };
  }

  componentDidMount() {
    const { fetchItems, selectedEntity } = this.props;
    fetchItems(selectedEntity);
  }

  onChangeNetwork = event => {
    const { changeNetwork } = this.props;
    changeNetwork(event.target.value);
  };

  onChangeTab = async (value: string) => {
    const { changeTab, fetchItems, selectedValues, removeValue } = this.props;
    await this.setState({ filterInputVal: [] });
    await selectedValues.forEach(value => {
      removeValue(value);
    });
    await changeTab(value);
    await fetchItems(value);
  };

  onFilterCollapse = () => {
    const { isFilterCollapse } = this.state;
    this.setState({ isFilterCollapse: !isFilterCollapse });
  };

  onCloseFilter = () => {
    this.setState({ isFilterCollapse: false });
  };

  resetValues = () => {
    const {
      selectedValues,
      removeValue,
      removeAllFilters,
      selectedEntity,
    } = this.props;
    this.setState({ filterInputVal: [] });
    removeAllFilters(selectedEntity);
    selectedValues.forEach(value => {
      removeValue(value);
    });
  };

  submitValues = async () => {
    const {
      setSelectedValues,
      submitQuery,
      selectedFilters,
      removeValue,
      selectedValues,
    } = this.props;
    const { filterInputState } = this.state;
    // const filterNames = await selectedFilters.map(
    //   filter => Object.values(filter)[0]
    // );
    // // Remove values from Redux state that are not represented in local state
    // await selectedValues.forEach(value => {
    //   if (!filterNames.includes(Object.keys(value)[0])) {
    //     removeValue(value);
    //   }
    // });
    // Loop through each value in state and set the value in Redux's state
    await filterInputState.forEach(val => {
      setSelectedValues(val);
    });
    // Submit the query to ConseilJS
    await submitQuery();
  };

  setFilterInputState = (val, filterName, filterOperator) => {
    const { filterInputState } = this.state;
    const filterState = [...filterInputState];
    let filterCheck = [];
    filterInputState.forEach(filter => {
      filterCheck.push(Object.keys(filter).toString());
    });
    if (val === null) {
      const itemToRemove = filterState.find(
        val => Object.keys(val).toString() === filterName
      );
      const index = filterState.indexOf(itemToRemove);
      filterState.splice(index, 1);
      this.setState({ filterInputState: filterState });
    } else if (
      filterCheck.includes(filterName) &&
      filterOperator !== 'BETWEEN'
    ) {
      const index = filterCheck.indexOf(filterName);
      filterState.splice(index, 1);
      const newState = [...filterState, { [filterName]: val }];
      this.setState({ filterInputState: newState });
    } else if (
      filterCheck.includes(filterName) &&
      filterOperator === 'BETWEEN'
    ) {
      const currentValueObject = filterState.find(
        val => Object.keys(val).toString() === filterName
      );
      const currentValue = Object.values(currentValueObject).toString();
      if (!currentValue.includes('-')) {
        if (val.includes('-')) {
          const index = filterCheck.indexOf(filterName);
          filterState.splice(index, 1);
          const newState = [
            ...filterState,
            { [filterName]: `${currentValue}${val}` },
          ];
          this.setState({ filterInputState: newState });
        } else if (!val.includes('-')) {
          const index = filterCheck.indexOf(filterName);
          filterState.splice(index, 1);
          const newState = [...filterState, { [filterName]: val }];
          this.setState({ filterInputState: newState });
        }
      } else if (currentValue.includes('-')) {
        if (val.includes('-')) {
          const value = Object.values(currentValue);
          const dashIndex = value.indexOf('-');
          const firstHalf = value.slice(0, dashIndex).join('');
          const secondHalf = val;
          const finalValue = firstHalf + secondHalf;
          const index = filterCheck.indexOf(filterName);
          filterState.splice(index, 1);
          const newState = [...filterState, { [filterName]: finalValue }];
          this.setState({ filterInputState: newState });
        } else if (!val.includes('-')) {
          const value = Object.values(currentValue);
          const dashIndex = value.indexOf('-');
          const secondHalf = value.slice(dashIndex).join('');
          const firstHalf = val;
          const finalValue = firstHalf + secondHalf;
          const index = filterCheck.indexOf(filterName);
          filterState.splice(index, 1);
          const newState = [...filterState, { [filterName]: finalValue }];
          this.setState({ filterInputState: newState });
        }
      }
    } else {
      const newValues = [...filterInputState, { [filterName]: val }];
      this.setState({
        filterInputState: newValues,
      });
    }
  };

  setFilterInput = async (val, filterName, filterOperator) => {
    const { filterInputVal } = this.state;
    const { selectedFilters } = this.props;
    // This takes all values from inputs, builds them into an object with their respective filter, and sets them to local state for query submission
    if (filterInputVal.length === 0) {
      const newValue = { [filterName]: val };
      this.setState({ filterInputVal: [newValue] });
    } else if (filterInputVal.length > 0) {
      let valueNames = [];
      filterInputVal.forEach(input => valueNames.push(...Object.keys(input)));
      if (!valueNames.includes(filterName)) {
        filterInputVal.push({ [filterName]: val });
      } else if (valueNames.includes(filterName)) {
        const currentValue = filterInputVal.find(
          value => Object.keys(value).toString() === filterName
        );
        const currentValues = Object.values(currentValue).toString();
        if (filterOperator === 'BETWEEN' && currentValues.includes('-')) {
          // Replace between value object with new between value object
          const index = valueNames.indexOf(filterName);
          filterInputVal.splice(index, 1);
          const value = {
            [filterName]: val,
          };
          filterInputVal.push(value);
        } else if (
          filterOperator === 'BETWEEN' &&
          !currentValues.includes('-')
        ) {
          // Add second part of between value object to first part of found between value object
          const value = {
            [filterName]: `${Object.values(currentValue) + val}`,
          };
          const index = valueNames.indexOf(filterName);
          filterInputVal.splice(index, 1);
          filterInputVal.push(value);
        } else {
          // Check for prior matching value object and replace with new value object (for all values that don't have BETWEEN values)
          const index = valueNames.indexOf(filterName);
          filterInputVal.splice(index, 1);
          const newValue = { [filterName]: val };
          filterInputVal.push(newValue);
        }
      }
      const currentFilters = selectedFilters.map(filter =>
        Object.values(filter)[0].toString()
      );
      const finalValues = [];
      // Make sure object values match selected filters before pushing to state
      filterInputVal.forEach(val => {
        if (currentFilters.includes(Object.keys(val).toString())) {
          finalValues.push(val);
        }
      });
      this.setState({ filterInputVal: finalValues });
    }
  };

  render() {
    const {
      isLoading,
      network,
      selectedEntity,
      items,
      selectedColumns,
    } = this.props;
    const { isFilterCollapse, filterInputVal, filterInputState } = this.state;
    console.log(filterInputState);
    return (
      <MainContainer>
        <Header network={network} onChangeNetwork={this.onChangeNetwork} />
        <Container>
          <TabsWrapper value={selectedEntity}>
            {tabsArray.map((item, index) => (
              <Tab
                key={index}
                value={item.value}
                component={() => (
                  <TabItem
                    isSelected={selectedEntity === item.value}
                    onClick={() => this.onChangeTab(item.value)}
                  >
                    {item.title}
                  </TabItem>
                )}
              />
            ))}
          </TabsWrapper>
          <SettingsPanel
            setFilterInputState={this.setFilterInputState}
            filterInputState={filterInputState}
            filterInputVal={filterInputVal}
            setFilterInput={this.setFilterInput}
            submitValues={this.submitValues}
            resetValues={this.resetValues}
            selectedColumns={selectedColumns}
            isCollapse={isFilterCollapse}
            onClose={this.onCloseFilter}
          />
          <FilterHeader isDark={isFilterCollapse}>
            <FilterTool value={2} onCollapse={this.onFilterCollapse} />
            <FilterExTxt>
              e.g. What blocks were baked by Foundation Baker 1 in the past 24
              hours?
            </FilterExTxt>
          </FilterHeader>
          <TabContainer component="div">
            <CustomTable
              items={items}
              entity={selectedEntity}
              selectedColumns={selectedColumns}
            />
          </TabContainer>
        </Container>
        <Footer />
        {isLoading && (
          <LoadingContainer>
            <CircularProgress />
          </LoadingContainer>
        )}
      </MainContainer>
    );
  }
}

const mapStateToProps = (state: any) => ({
  selectedFilters: getSelectedFilters(state),
  selectedValues: getSelectedValues(state),
  selectedColumns: getColumns(state),
  isLoading: getLoading(state),
  network: getNetwork(state),
  selectedEntity: getEntity(state),
  items: getItems(state),
  attributes: getAttributes(state),
});

const mapDispatchToProps = dispatch => ({
  setSelectedValues: (value: object[]) =>
    dispatch(setSelectedValuesAction(value)),
  removeAllFilters: (selectedEntity: string) =>
    dispatch(removeAllFiltersAction(selectedEntity)),
  removeValue: (value: object) => dispatch(removeValueAction(value)),
  changeNetwork: (network: string) => dispatch(changeNetwork(network)),
  changeTab: (type: string) => dispatch(setTabAction(type)),
  fetchItems: (type: string) => dispatch(fetchItemsAction(type)),
  submitQuery: () => dispatch(submitQuery()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Arronax);
