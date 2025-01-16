function confirmDelete(bookId) {
    const userConfirmed = confirm("This will delete the book.");
    if (userConfirmed) {
        fetch(`/admin/delete/${bookId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                alert("Book deleted successfully!");
                window.location.reload();
            } else {
                alert("Failed to delete the book. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error deleting book:', error);
            alert("An error occurred. Please try again.");
        });
    }
}
