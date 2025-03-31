"""Make users name optional

Revision ID: 1c92a970c173
Revises: 98611bcf0e35
Create Date: 2025-03-24 22:31:41.189150

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "1c92a970c173"
down_revision: Union[str, None] = "98611bcf0e35"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("users", "name", existing_type=sa.VARCHAR(length=50), nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "users", "name", existing_type=sa.VARCHAR(length=50), nullable=False
    )
    # ### end Alembic commands ###
