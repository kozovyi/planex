from fastapi import HTTPException, status

board_not_found_exc = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Board not found",
)

bad_filter_exc = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Invalid filter condition",
)
