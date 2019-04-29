import React, { Component } from "react";
import Paginate from "../_helper/paginate";
import PropTypes from "prop-types";
import {
  Grid,
  Header,
  Segment,
  Input,
  Table,
  Pagination,
  Select,
  Icon,
  Checkbox,
  Button,
  Label,
  Popup
} from "semantic-ui-react";
import { PageSize } from "../_helper/SelectList";
import _ from "lodash";
import Filtering from "../_helper/filtering";

class MyTable extends Component {
  state = {
    searchValue: "",
    pageSize: 10,
    currentPage: 1,
    orderBy: this.props.orderBy,
    orderDirection: this.props.orderDirection
  };

  static propTypes = {
    searchBar: PropTypes.bool,
    orderBy: PropTypes.number,
    orderDirection: PropTypes.oneOf(["asc", "desc"]),
    selection: PropTypes.bool,
    onSelectedChange: PropTypes.func,
    title: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    button: PropTypes.element
  };

  static defaultProps = {
    searchBar: false,
    orderDirection: "asc",
    selection: false,
    orderBy: 0,
    selectedRow: []
  };

  handleSelectPageSize = (e, data) => {
    this.setState({ pageSize: data.value });
  };

  handlePageChange = (e, data) => {
    //clear selection before unmounting
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
      const a = this.props.header;
      _.forEach(a, (x, i) => {
        if (
          x.content !== "" &&
          (e.target.attributes.name &&
            x.name === e.target.attributes.name.value)
        ) {
          const direction = x.className === "asc" ? "desc" : "asc";
          this.setState({ orderBy: i, orderDirection: direction });
        }
      });
    }
  };

  handleSelectionOnChange = (data, checked) => {
    let selectedRow = [];
    if (checked) {
      selectedRow = [...this.props.selectedRow, data];
    } else {
      selectedRow = this.props.selectedRow.filter(x => !_.isEqual(x, data));
    }
    this.props.onSelectedChange && this.props.onSelectedChange(selectedRow);
  };

  handleClearSelection = () => {
    this.props.onSelectedChange && this.props.onSelectedChange([]);
  };

  render() {
    const {
      data,
      title,
      button,
      searchBar,
      selection,
      body,
      header
    } = this.props;

    const {
      pageSize,
      currentPage,
      searchValue,
      orderBy,
      orderDirection
    } = this.state;

    //show order icon in header
    const headerWithOrder = header;
    _.forEach(headerWithOrder, (x, i) => {
      if (orderBy === i) {
        x.className = orderDirection;
      } else {
        x.className = "";
      }
    });

    //header and body with checkbox
    const hr = [{ key: "cb-0", content: "" }, ...headerWithOrder];
    const br = (data, i) => ({
      ...this.props.body(data, i),
      cells: [
        {
          key: `cb-${i}`,
          width: 1,
          content: (
            <Checkbox
              toggle
              checked={_.find(this.props.selectedRow, data) ? true : false}
              onChange={(e, props) =>
                this.handleSelectionOnChange(data, props.checked)
              }
            />
          )
        },
        ...this.props.body(data, i).cells
      ],
      active: _.find(this.props.selectedRow, data) ? true : false
    });
    const renderFooter = [
      {
        key: "footer",
        as: "th",
        colSpan: headerWithOrder.length,
        content: (
          <React.Fragment>
            {this.props.selectedRow.length !== 0 && (
              <Button.Group onClick={this.handleClearSelection}>
                <Button as="div" labelPosition="left">
                  <Label basic color="red">
                    {this.props.selectedRow.length}
                  </Label>
                  <MyTable.Button label="Unselect" icon="erase" color="red" />
                </Button>
              </Button.Group>
            )}{" "}
            {button}
          </React.Fragment>
        ),
        textAlign: "left"
      }
    ];
    const footerWithCb = [
      {
        key: "footer-1",
        content: ""
      },
      ...renderFooter
    ];

    //render when no data in table
    const noData = [{ name: "No data available" }];
    const renderBodyRowEmpty = ({ name }, i) => ({
      key: i,
      cells: [
        {
          key: i,
          colSpan: selection ? header.length + 1 : header.length,
          content: name
        }
      ],
      textAlign: "center"
    });

    const sortedData = _.orderBy(data, header[orderBy].name, orderDirection);
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
              {searchBar && (
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
                celled
                sortable
                selectable
                definition={selection}
                onClick={this.handleSort}
                textAlign="center"
                headerRow={selection ? hr : headerWithOrder}
                renderBodyRow={
                  paginatedData.length !== 0
                    ? selection
                      ? br
                      : body
                    : renderBodyRowEmpty
                }
                tableData={paginatedData.length !== 0 ? paginatedData : noData}
                footerRow={button && (selection ? footerWithCb : renderFooter)}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid verticalAlign="middle" padded>
          <Grid.Column textAlign="center">
            <Popup
              content="Select row size per table"
              position="top center"
              trigger={
                <Select
                  style={{ marginRight: 10, verticalAlign: "middle" }}
                  onChange={this.handleSelectPageSize}
                  compact
                  options={PageSize}
                  defaultValue={pageSize}
                />
              }
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

MyTable.Button = props => {
  return (
    <Button
      animated
      size="mini"
      action={props.action}
      color={props.color || "blue"}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <Button.Content visible>{props.label}</Button.Content>
      <Button.Content hidden>
        <Icon name={props.icon} />
      </Button.Content>
    </Button>
  );
};

export default MyTable;
