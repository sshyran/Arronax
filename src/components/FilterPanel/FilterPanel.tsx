import * as React from 'react';
import { TezosFilter } from 'conseiljs';
import { Button } from 'antd';

import FilterPanelControl from './FilterPanelControl';
import NetworkSwitch from './NetworkSwitch';

interface FilterPanelProps {
  filters: TezosFilter;
  network: string;
  setFilter: (filters: TezosFilter, network: string) => void;
}

interface FilterPanelState extends TezosFilter {
  network: string;
}

const controls = [
  {
    label: 'Block IDs',
    type: 'block_id',
    applied: true
  },
  {
    label: 'Block Levels',
    type: 'block_level',
    applied: true
  },
  {
    label: 'Net IDs',
    type: 'block_netid',
    applied: true
  },
  {
    label: 'Protocols',
    type: 'block_protocol',
    applied: true
  },
  {
    label: 'Operation IDs',
    type: 'operation_id',
    applied: true
  },
  {
    label: 'Operation Sources',
    type: 'operation_source',
    applied: true
  },
  {
    label: 'Operation Participants',
    type: 'operation_participant',
    applied: true
  },
  {
    label: 'Operation Destinations',
    type: 'operation_destination',
    applied: true
  },
  {
    label: 'Operation Kinds',
    type: 'operation_kind',
    applied: true
  },
  {
    label: 'Account IDs',
    type: 'account_id',
    applied: true
  },
  {
    label: 'Account Managers',
    type: 'account_manager',
    applied: true
  },
  {
    label: 'Account Delegates',
    type: 'account_delegate',
    applied: true
  },
  {
    label: 'Limit',
    type: 'limit',
    applied: true
  }
];

export class FilterPanel extends React.Component<
  FilterPanelProps,
  FilterPanelState
> {
  public constructor(props: FilterPanelProps) {
    super(props);
    this.state = {...props.filters, ...{ network: props.network} };
  }

  public handleFilterProps = (
    propName: string,
    ctrlPosition: number,
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    event.preventDefault();
    // @ts-ignore
    this.setState({
        [propName]: propName === 'limit' ? Number(event.target.value) : event.target.value.split(',')
    });
    controls[ctrlPosition].applied = false;
  }

  public handleNetworkSwitch = value => {
    this.setState({network: value});
  }

  public handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    const filterProps = {...this.state};
    delete filterProps.network;
    this.props.setFilter(filterProps, this.state.network);
    controls.forEach(control => control.applied = true);
  }

  public render(): JSX.Element {
    return (
      <div style={{width: '100%', padding: '10px'}}>
        <NetworkSwitch network={this.state.network} ntwChange={(value) => this.handleNetworkSwitch(value)}/>
        {controls.map((control, index) => {
          return (
              <div key={index}>
                <FilterPanelControl
                    ctrlLabel={control.label}
                    ctrlType={control.type}
                    ctrlValue={this.state[control.type].toString()}
                    ctrlControlIndex={index}
                    ctrlChange={this.handleFilterProps}
                    ctrlBordered={!control.applied}
                />
              </div>
          );
        })}
        <div style={{margin: 'auto', marginTop: '10px', width: '100px'}}>
          <Button htmlType="button" onClick={this.handleSubmit}>Refresh</Button>
        </div>
      </div>
    );
  }
}
