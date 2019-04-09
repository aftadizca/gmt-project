import React, { Component } from "react";
import _ from "lodash";
import Paginate from "../_helper/paginate";
import {
  Grid,
  Header,
  Segment,
  Search,
  Icon,
  Menu,
  Input,
  Popup,
  Button,
  Table,
  Pagination
} from "semantic-ui-react";

class MyTable extends Component {
  state = {
    searchValue: ""
  };

  render() {
    const {
      headerRow,
      renderBodyRow,
      data,
      title,
      pagination,
      onPageChange,
      onSearch,
      button
    } = this.props;

    //render when no data in table
    const noData = [{ name: "No data available" }];
    const renderBodyRowEmpty = ({ name }, i) => ({
      key: i,
      cells: [
        {
          key: i,
          colSpan: headerRow.length,
          content: name
        }
      ],
      textAlign: "center"
    });

    const pageLength = Math.ceil(data.length / pagination.pageSize);
    const currentPage =
      pagination.currentPage > pageLength ? pageLength : pagination.currentPage;

    //Pagination
    const paginatedData = Paginate(data, currentPage, pagination.pageSize);

    return (
      <React.Fragment>
        <Grid padded textAlign="center">
          <Grid.Row columns={2}>
            <Grid.Column>
              <Segment inverted color="blue" stacked>
                <Header as="h1">{title}</Header>
              </Segment>
            </Grid.Column>
            <Grid.Column verticalAlign="middle" textAlign="right">
              {button}{" "}
              <Input icon="search" placeholder="Search..." onInput={onSearch} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Table
                color="blue"
                celled
                textAlign="center"
                headerRow={headerRow}
                renderBodyRow={
                  paginatedData.length !== 0
                    ? renderBodyRow
                    : renderBodyRowEmpty
                }
                tableData={paginatedData.length !== 0 ? paginatedData : noData}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row textAlign="center">
            <Grid.Column>
              {pageLength === 1 ? (
                ""
              ) : (
                <Pagination
                  activePage={currentPage}
                  boundaryRange={1}
                  onPageChange={onPageChange}
                  siblingRange={1}
                  totalPages={pageLength}
                />
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}

export default MyTable;
