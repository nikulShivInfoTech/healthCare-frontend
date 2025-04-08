import { useSnackbarStore } from '../stores/snackbar';

export const handleApiError = (error) => {
    const snackbarStore = useSnackbarStore();

    if (error.response?.data) {
        const errorData = error.response.data;
        if (Array.isArray(errorData.message)) {
            snackbarStore.showMessage(errorData.message[0], "error");
        } else if (errorData.message) {
            snackbarStore.showMessage(errorData.message, "error");
        }
    }
};

