import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import styles from './app-table.module.css';

export type AppTableHeader = {
  title: string | number;
  isNumeric?: boolean;
  className?: string;
};

export type AppTableData = {
  id: string;
  [key: string]: string | number | boolean;
};

export type AppTable = {
  headers: AppTableHeader[];
  caption: string;
  data: AppTableData[];
  footer?: AppTableHeader[];
};

function Cell(props: { data: AppTableData; header: AppTableHeader }) {
  const { data, header } = props;
  if (data.eliminated) {
    return (
      <em>
        <del>{data[header.title]}</del>
      </em>
    );
  }

  if (data.highlighted) {
    return <b>{data[header.title]}</b>;
  }
  return <span>{data[header.title]}</span>;
}

export function AppTable(props: AppTable) {
  const { headers, data, footer } = props;
  return (
    <TableContainer>
      <Table
        variant="simple"
        className={styles.appTable}
        size={{ base: 'sm', md: 'md', lg: 'lg' }}
      >
        <TableCaption>{props.caption}</TableCaption>
        <Thead>
          <Tr>
            {headers.map((header) => (
              <Th
                key={header.title}
                isNumeric={header.isNumeric}
                className={header.className}
              >
                {header.title}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((rowData) => {
            return (
              <Tr key={rowData.id}>
                {headers.map((header) => (
                  <Td key={header.title} isNumeric={header.isNumeric}>
                    <Cell data={rowData} header={header} />
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
        {footer && (
          <Tfoot>
            <Tr>
              {footer.map((ft) => (
                <Th key={ft.title} isNumeric={ft.isNumeric}>
                  {ft.title}
                </Th>
              ))}
            </Tr>
          </Tfoot>
        )}
      </Table>
    </TableContainer>
  );
}
