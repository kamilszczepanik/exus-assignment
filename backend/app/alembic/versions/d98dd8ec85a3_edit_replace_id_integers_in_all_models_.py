"""Edit replace id integers in all models to use UUID instead

Revision ID: d98dd8ec85a3
Revises: 9c0a54914c78
Create Date: 2024-07-19 04:08:04.000976

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'd98dd8ec85a3'
down_revision = '9c0a54914c78'
branch_labels = None
depends_on = None

def upgrade():
    # Ensure uuid-ossp extension is available
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    # Create a new UUID column with a default UUID value
    op.add_column('user', sa.Column('new_id', postgresql.UUID(as_uuid=True), default=sa.text('uuid_generate_v4()')))
    op.add_column('item', sa.Column('new_id', postgresql.UUID(as_uuid=True), default=sa.text('uuid_generate_v4()')))
    op.add_column('item', sa.Column('new_owner_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.add_column('weatherforecast', sa.Column('new_user_id', postgresql.UUID(as_uuid=True), nullable=True))  # Added for WeatherForecast

    # Populate the new columns with UUIDs
    op.execute('UPDATE "user" SET new_id = uuid_generate_v4()')
    op.execute('UPDATE item SET new_id = uuid_generate_v4()')
    op.execute('UPDATE item SET new_owner_id = (SELECT new_id FROM "user" WHERE "user".id = item.owner_id)')
    op.execute('UPDATE weatherforecast SET new_user_id = (SELECT new_id FROM "user" WHERE "user".id = weatherforecast.user_id)')  # Update WeatherForecast

    # Set the new_id as not nullable
    op.alter_column('user', 'new_id', nullable=False)
    op.alter_column('item', 'new_id', nullable=False)
    op.alter_column('weatherforecast', 'new_user_id', nullable=False)  # Make it not nullable for WeatherForecast

    # Drop old foreign key constraints
    op.drop_constraint('item_owner_id_fkey', 'item', type_='foreignkey')
    op.drop_constraint('weatherforecast_user_id_fkey', 'weatherforecast', type_='foreignkey')  # Drop WeatherForecast FK

    # Drop old columns and rename new columns
    op.drop_column('item', 'owner_id')
    op.alter_column('item', 'new_owner_id', new_column_name='owner_id')
    
    op.drop_column('weatherforecast', 'user_id')  # Drop user_id in WeatherForecast
    op.alter_column('weatherforecast', 'new_user_id', new_column_name='user_id')  # Rename new_user_id to user_id

    op.drop_column('user', 'id')
    op.alter_column('user', 'new_id', new_column_name='id')

    op.drop_column('item', 'id')
    op.alter_column('item', 'new_id', new_column_name='id')

    # Create primary key constraint
    op.create_primary_key('user_pkey', 'user', ['id'])
    op.create_primary_key('item_pkey', 'item', ['id'])

    # Recreate foreign key constraints
    op.create_foreign_key('item_owner_id_fkey', 'item', 'user', ['owner_id'], ['id'])
    op.create_foreign_key('weatherforecast_user_id_fkey', 'weatherforecast', 'user', ['user_id'], ['id'])  # Recreate WeatherForecast FK

def downgrade():
    # Reverse the upgrade process
    op.add_column('user', sa.Column('old_id', sa.Integer, autoincrement=True))
    op.add_column('item', sa.Column('old_id', sa.Integer, autoincrement=True))
    op.add_column('item', sa.Column('old_owner_id', sa.Integer, nullable=True))

    # Populate the old columns with default values
    # Generate sequences for the integer IDs if not exist
    op.execute('CREATE SEQUENCE IF NOT EXISTS user_id_seq AS INTEGER OWNED BY "user".old_id')
    op.execute('CREATE SEQUENCE IF NOT EXISTS item_id_seq AS INTEGER OWNED BY item.old_id')

    op.execute('SELECT setval(\'user_id_seq\', COALESCE((SELECT MAX(old_id) + 1 FROM "user"), 1), false)')
    op.execute('SELECT setval(\'item_id_seq\', COALESCE((SELECT MAX(old_id) + 1 FROM item), 1), false)')

    op.execute('UPDATE "user" SET old_id = nextval(\'user_id_seq\')')
    op.execute('UPDATE item SET old_id = nextval(\'item_id_seq\'), old_owner_id = (SELECT old_id FROM "user" WHERE "user".id = item.owner_id)')

    # Drop new columns and rename old columns back
    op.drop_constraint('item_owner_id_fkey', 'item', type_='foreignkey')
    op.drop_column('item', 'owner_id')
    op.alter_column('item', 'old_owner_id', new_column_name='owner_id')

    op.drop_column('user', 'id')
    op.alter_column('user', 'old_id', new_column_name='id')

    op.drop_column('item', 'id')
    op.alter_column('item', 'old_id', new_column_name='id')

    # Create primary key constraint
    op.create_primary_key('user_pkey', 'user', ['id'])
    op.create_primary_key('item_pkey', 'item', ['id'])

    # Recreate foreign key constraint
    op.create_foreign_key('item_owner_id_fkey', 'item', 'user', ['owner_id'], ['id'])
