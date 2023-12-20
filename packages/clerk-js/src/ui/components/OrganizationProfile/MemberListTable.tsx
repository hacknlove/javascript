import React, { useMemo } from 'react';

import type { LocalizationKey } from '../../customizables';
import { Col, descriptors, Flex, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from '../../customizables';
import { Pagination, Select, SelectButton, SelectOptionList } from '../../elements';
import { useLocalizeCustomRoles } from '../../hooks/useFetchRoles';
import type { PropsOfComponent, ThemableCssProp } from '../../styledSystem';

type MembersListTableProps = {
  headers: LocalizationKey[];
  rows: React.ReactNode[];
  isLoading?: boolean;
  page: number;
  onPageChange: (page: number) => void;
  itemCount: number;
  emptyStateLocalizationKey: LocalizationKey;
  pageCount: number;
  itemsPerPage: number;
};

export const DataTable = (props: MembersListTableProps) => {
  const {
    headers,
    page,
    onPageChange,
    rows,
    isLoading,
    itemCount,
    itemsPerPage,
    pageCount,
    emptyStateLocalizationKey,
  } = props;

  const startingRow = itemCount > 0 ? Math.max(0, (page - 1) * itemsPerPage) + 1 : 0;
  const endingRow = Math.min(page * itemsPerPage, itemCount);

  return (
    <Col
      gap={4}
      sx={{ width: '100%' }}
    >
      <Flex sx={t => ({ overflowX: 'auto', padding: t.space.$1 })}>
        <Table sx={{ width: '100%' }}>
          <Thead>
            <Tr>
              {headers.map((h, index) => (
                <Th
                  elementDescriptor={descriptors.tableHead}
                  key={index}
                  localizationKey={h}
                />
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={4}>
                  <Spinner
                    colorScheme='primary'
                    sx={{ margin: 'auto', display: 'block' }}
                    elementDescriptor={descriptors.spinner}
                  />
                </Td>
              </Tr>
            ) : !rows.length ? (
              <EmptyRow
                key='empty'
                localizationKey={emptyStateLocalizationKey}
              />
            ) : (
              rows
            )}
          </Tbody>
        </Table>
      </Flex>
      {
        <Pagination
          count={pageCount}
          page={page}
          onChange={onPageChange}
          siblingCount={1}
          rowInfo={{
            allRowsCount: itemCount,
            startingRow,
            endingRow,
          }}
        />
      }
    </Col>
  );
};

const EmptyRow = (props: { localizationKey: LocalizationKey }) => {
  return (
    <Tr>
      <Td colSpan={4}>
        <Text
          localizationKey={props.localizationKey}
          sx={t => ({
            margin: 'auto',
            display: 'block',
            width: 'fit-content',
            fontSize: t.fontSizes.$xs,
          })}
        />
      </Td>
    </Tr>
  );
};

export const RowContainer = (props: PropsOfComponent<typeof Tr>) => {
  return (
    <Tr
      {...props}
      sx={t => ({ ':hover': { backgroundColor: t.colors.$blackAlpha50 } })}
    />
  );
};

export const RoleSelect = (props: {
  roles: { label: string; value: string }[] | undefined;
  value: string;
  onChange: (params: string) => unknown;
  isDisabled?: boolean;
  triggerSx?: ThemableCssProp;
  optionListSx?: ThemableCssProp;
}) => {
  const { value, roles, onChange, isDisabled, triggerSx, optionListSx } = props;

  const { localizeCustomRole } = useLocalizeCustomRoles();

  const fetchedRoles = useMemo(() => [...(roles || [])], [roles]);

  const selectedRole = useMemo(() => fetchedRoles.find(r => r.value === value), [fetchedRoles]);

  const localizedOptions = useMemo(
    () =>
      fetchedRoles.map(role => ({
        value: role.value,
        label: localizeCustomRole(role.value) || role.label,
      })),
    [fetchedRoles, localizeCustomRole],
  );

  return (
    <Select
      elementId='role'
      options={localizedOptions}
      value={value}
      onChange={role => onChange(role.value)}
    >
      {/*Store value inside an input in order to be accessible as form data*/}
      <input
        name='role'
        type='hidden'
        value={value}
      />
      <SelectButton
        sx={
          triggerSx ||
          (t => ({
            color: t.colors.$colorTextSecondary,
            backgroundColor: 'transparent',
            textWrap: 'nowrap',
          }))
        }
        isDisabled={isDisabled}
      >
        {localizeCustomRole(selectedRole?.value) || selectedRole?.label}
      </SelectButton>
      <SelectOptionList sx={optionListSx} />
    </Select>
  );
};
