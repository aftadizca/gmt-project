import React, { Component } from "react";
import _ from "lodash";
import Paginate from "../_helper/paginate";
import {
  Grid,
  Header,
  Segment,
  Input,
  Table,
  Pagination,
  Select,
  Button,
  Icon
} from "semantic-ui-react";
import { PageSize } from "../_helper/SelectList";
import Filtering from "./../_helper/filtering";

class MyTable extends Component {
  state = {
    searchValue: "",
    pageSize: 10,
    currentPage: 1
  };

  handleSelectPageSize = (e, data) => {
    this.setState({ pageSize: data.value });
  };

  handlePageChange = (e, data) => {
    this.setState({ currentPage: data.activePage });
  };

  handleOnSearch = e => {
    console.log(e.currentTarget.value);
    this.setState({ searchValue: e.currentTarget.value });
  };

  handleOnSearchClear = () => {
    this.setState({ searchValue: "" });
  };

  render() {
    const { headerRow, renderBodyRow, data, title, button } = this.props;

    const { pageSize, currentPage, searchValue } = this.state;

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

    //filtering with search
    const filteredData = Filtering(data, searchValue);
    //count length row per page
    const pageLength = Math.ceil(filteredData.length / pageSize);
    //check if current page greater than page size
    const cPage = currentPage > pageLength ? pageLength : currentPage;
    //Pagination
    const paginatedData = Paginate(filteredData, cPage, pageSize);

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
              <Input
                icon={
                  <Icon
                    name={this.state.searchValue.length ? "x" : "search"}
                    inverted
                    color="blue"
                    circular
                    link
                    onClick={this.handleOnSearchClear}
                  />
                }
                placeholder="Search..."
                value={this.state.searchValue}
                onInput={this.handleOnSearch}
              />
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
        </Grid>

        <Grid verticalAlign="middle" padded>
          <Grid.Column textAlign="right">
            <Select
              style={{ marginRight: 10, verticalAlign: "middle" }}
              onChange={this.handleSelectPageSize}
              compact
              options={PageSize}
              defaultValue={pageSize}
            />
            {pageLength === 1 ? (
              ""
            ) : (
              <Pagination
                activePage={cPage}
                boundaryRange={1}
                onPageChange={this.handlePageChange}
                siblingRange={1}
                totalPages={pageLength}
              />
            )}
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}

export default MyTable;
