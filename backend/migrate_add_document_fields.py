"""
Migration script to add new document fields to users table
Run this script once to add: selfie_photo, income_proof, reference_letter columns
"""
from app import create_app
from models import db
from sqlalchemy import text

def migrate():
    """Add new document columns to users table"""
    app = create_app()

    with app.app_context():
        try:
            # Check if columns already exist
            check_query = text("""
                SELECT COLUMN_NAME
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = :db_name
                AND TABLE_NAME = 'users'
                AND COLUMN_NAME IN ('selfie_photo', 'income_proof', 'reference_letter')
            """)

            result = db.session.execute(
                check_query,
                {'db_name': app.config['DB_NAME']}
            ).fetchall()

            existing_columns = [row[0] for row in result]

            # Add columns that don't exist
            columns_to_add = []

            if 'selfie_photo' not in existing_columns:
                columns_to_add.append('selfie_photo')

            if 'income_proof' not in existing_columns:
                columns_to_add.append('income_proof')

            if 'reference_letter' not in existing_columns:
                columns_to_add.append('reference_letter')

            if not columns_to_add:
                print("✓ All document columns already exist. No migration needed.")
                return

            print(f"Adding columns: {', '.join(columns_to_add)}")

            # Add selfie_photo column
            if 'selfie_photo' in columns_to_add:
                alter_query = text("""
                    ALTER TABLE users
                    ADD COLUMN selfie_photo VARCHAR(255) AFTER id_card_photo
                """)
                db.session.execute(alter_query)
                print("✓ Added column: selfie_photo")

            # Add income_proof column
            if 'income_proof' in columns_to_add:
                position = 'selfie_photo' if 'selfie_photo' not in columns_to_add else 'selfie_photo'
                alter_query = text(f"""
                    ALTER TABLE users
                    ADD COLUMN income_proof VARCHAR(255) AFTER {position}
                """)
                db.session.execute(alter_query)
                print("✓ Added column: income_proof")

            # Add reference_letter column
            if 'reference_letter' in columns_to_add:
                alter_query = text("""
                    ALTER TABLE users
                    ADD COLUMN reference_letter VARCHAR(255) AFTER income_proof
                """)
                db.session.execute(alter_query)
                print("✓ Added column: reference_letter")

            db.session.commit()
            print("\n✓ Migration completed successfully!")
            print("✓ Users table now supports all 4 document types:")
            print("  - id_card_photo (existing)")
            print("  - selfie_photo (new)")
            print("  - income_proof (new)")
            print("  - reference_letter (new)")

        except Exception as e:
            db.session.rollback()
            print(f"\n✗ Migration failed: {str(e)}")
            raise

if __name__ == '__main__':
    print("=== Document Fields Migration ===")
    print("This will add new document columns to the users table\n")

    migrate()
