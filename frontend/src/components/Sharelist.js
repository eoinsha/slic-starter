import React, { Component } from 'react'
import {
  Typography,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  DialogContent,
  DialogContentText
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { addCollaborator, loadCollaborators } from '../actions/share'

const styles = {
  error: {
    color: 'red'
  },

  success: {
    color: 'green'
  }
}

class ShareList extends Component {
  state = {
    email: '',
    errorMessage: ''
  }

  handleChange = ({ target: { value } }) => {
    this.setState({ email: value })
  }

  handleSubmit = event => {
    event.preventDefault()
    const { list } = this.props
    this.props.dispatch(
      addCollaborator({
        email: this.state.email,
        listId: list.listId,
        listName: list.name
      })
    )
    this.setState({ email: '' })
  }

  componentDidUpdate() {
    const { list } = this.props
    if (list) {
      this.props.dispatch(loadCollaborators({ listId: list.listId }))
    }
  }

  componentDidMount() {
    const { list } = this.props
    if (list) {
      this.props.dispatch(loadCollaborators({ listId: list.listId }))
    }
  }

  render() {
    const {
      open,
      onClose,
      classes,
      list,
      createdCollaborator,
      createCollaboratorError
    } = this.props

    const shareFailure =
      createCollaboratorError && !createdCollaborator ? (
        <Typography className={classes.error}>
          An error occured sharing {list.name}
        </Typography>
      ) : null

    const shareSuccess = createdCollaborator ? (
      <Typography className={classes.success}>
        List shared successfully!
      </Typography>
    ) : null

    return (
      <Dialog
        open={open}
        list={list}
        keepMounted
        onClose={onClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Share List</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Typography>Share {list.name} with friends!</Typography>
            {shareFailure}
            {shareSuccess}
          </DialogContentText>
          <Grid container>
            <Grid item>
              <TextField
                className={classes.textfield}
                placeholder="Collaborator email"
                onChange={this.handleChange}
                value={this.state.email}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleSubmit}
            color="primary"
            disabled={this.state.email.length < 1}
          >
            Add
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

ShareList.propTypes = {
  auth: PropTypes.object,
  list: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  createdCollaborator: PropTypes.bool,
  createCollaboratorError: PropTypes.object
}

const mapStateToProps = ({
  checklists: { createdCollaborator, createCollaboratorError }
}) => ({ createdCollaborator, createCollaboratorError })

export default connect(mapStateToProps)(withStyles(styles)(ShareList))
