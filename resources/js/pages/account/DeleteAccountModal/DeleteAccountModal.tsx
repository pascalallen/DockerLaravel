import _ from 'lodash';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { Form, Modal } from 'react-bootstrap';
import { logout } from '@/redux/userSlice';
import { RootState } from '@/types/redux';
import userApi from '@/api/user';
import Select from '@/components/Select/Select';

type Props = {
  show: boolean;
  onClose: () => void;
};

type State = {
  deleteAccount: boolean;
  isDeleting: boolean;
};

const initialState: State = {
  deleteAccount: false,
  isDeleting: false
};

const DeleteAccountModal = (props: Props): React.ReactElement => {
  const { show, onClose } = props;

  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const [deleteAccount, setDeleteAccount] = useState(initialState.deleteAccount);
  const [isDeleting, setIsDeleting] = useState(initialState.isDeleting);

  const handleDelete = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!deleteAccount) {
      return onClose();
    }

    if (_.isUndefined(user.id)) {
      return onClose();
    }

    setIsDeleting(true);
    try {
      await userApi.remove(user.id);
      await dispatch(logout());
      addToast('Account deleted successfully!', { appearance: 'success', autoDismiss: true });
      setIsDeleting(initialState.isDeleting);
      onClose();
    } catch (error: any) {
      if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
        await dispatch(logout());
      }
      addToast(error.data.message, { appearance: 'error' });
      setIsDeleting(initialState.isDeleting);
    }
  };

  const formName = 'delete-account-modal';

  return (
    <Modal
      show={show}
      onHide={onClose}
      className="d-flex flex-column align-items-center align-self-center justify-content-center rounded-lg position-absolute">
      <Modal.Header className="border-0 pb-md-0" closeButton />
      <Modal.Body className="px-md-5">
        <p className="mb-5">Deleting your account will terminate your account.</p>
        <Form
          onSubmit={(event: React.FormEvent<HTMLFormElement>): Promise<void> => handleDelete(event)}
          name={formName}>
          <Select
            required
            formName={formName}
            name="delete_account"
            label="Would you still like to delete your account?"
            tabIndex={1}
            defaultValue="false"
            handleChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
              setDeleteAccount(event.target.value === 'true')
            }>
            <option value="false">Nevermind.</option>
            <option value="true">Yes. DELETE ME</option>
          </Select>
          <button className="btn btn-danger mb-5" type="submit" tabIndex={2} disabled={isDeleting}>
            {isDeleting ? (
              <React.Fragment>
                <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" />
                Deleting...
              </React.Fragment>
            ) : (
              <React.Fragment>Delete</React.Fragment>
            )}
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteAccountModal;
