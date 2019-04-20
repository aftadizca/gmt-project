import React, { Component } from "react";
import Paginate from "../_helper/paginate";
import {
  Grid,
  Header,
  Segment,
  Input,
  Table,
  Pagination,
  Select,
  Icon,
  Label
} from "semantic-ui-react";
import { PageSize } from "../_helper/SelectList";
import _ from "lodash";
import Filtering from "./../_helper/filtering";

class MyTable extends Component {
  state = {
    searchValue: "",
    pageSize: 10,
    currentPage: 1,
    orderBy: this.props.orderBy,
    orderDirection: this.props.orderDirection,
    headerRow: this.props.headerRow
  };

  handleSelectPageSize = (e, data) => {
    this.setState({ pageSize: data.value });
  };

  handlePageChange = (e, data) => {
    this.setState({ currentPage: data.activePage });
  };

  handleOnSearch = e => {
    this.setState({ searchValue: e.currentTarget.value });
  };

  handleOnSearchClear = () => {
    this.setState({ searchValue: "" });
  };
  handleSort = e => {
    if (e.target.attributes.name && e.target.nodeName === "TH") {
      const a = this.state.headerRow;
      _.forEach(a, x => {
        if (
          x.content !== "" &&
          (e.target.attributes.name &&
            x.name === e.target.attributes.name.value)
        ) {
          const direction = x.className === "asc" ? "desc" : "asc";
          this.setState({ orderBy: x.name, orderDirection: direction });
        }
      });
    }
  };

  render() {
    const { renderBodyRow, data, title, button, actionBar } = this.props;

    const {
      pageSize,
      currentPage,
      searchValue,
      headerRow,
      orderBy,
      orderDirection
    } = this.state;

    const header = headerRow;
    _.forEach(header, x => {
      if (x.name === orderBy) {
        x.className = orderDirection;
      } else {
        x.className = "";
      }
    });

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

    var sortedData = _.orderBy(data, orderBy, orderDirection);
    //filtering with search
    const filteredData = Filtering(sortedData, searchValue);
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
              <Segment color="blue" inverted>
                <Header as="h1">{title} </Header>
              </Segment>
            </Grid.Column>
            <Grid.Column verticalAlign="middle" textAlign="right">
              {button}{" "}
              {actionBar && (
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
                  placeholder="SEARCH"
                  value={this.state.searchValue}
                  onInput={this.handleOnSearch}
                />
              )}
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Table
                color="blue"
                celled
                sortable
                selectable
                onClick={this.handleSort}
                striped
                textAlign="center"
                headerRow={header}
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
          <Grid.Column textAlign="center">
            <Select
              style={{ marginRight: 10, verticalAlign: "middle" }}
              onChange={this.handleSelectPageSize}
              compact
              options={PageSize}
              defaultValue={pageSize}
            />
            {pageLength <= 1 ? (
              ""
            ) : (
              <Pagination
                activePage={cPage}
                boundaryRange={2}
                onPageChange={this.handlePageChange}
                siblingRange={3}
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
