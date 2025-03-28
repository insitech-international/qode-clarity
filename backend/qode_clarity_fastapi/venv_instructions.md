# Poetry Environment Setup

## Install Poetry

If you haven't installed Poetry yet:

```
curl -sSL https://install.python-poetry.org | python3 -
```

Or on Windows with PowerShell:

```
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -
```

## Initialize a Poetry project

```
cd c:\Users\admin\Desktop\code_clarity\backend\code_clarity_fastapi
poetry init
```

## Add dependencies

```
poetry add fastapi uvicorn firebase-admin
```

## Activate Poetry virtual environment

```
poetry shell
```

## Install existing dependencies from pyproject.toml

```
poetry install
```

## Run commands within Poetry environment without activating

```
poetry run python main.py
```

## Exit the Poetry shell when done

```
exit
```
