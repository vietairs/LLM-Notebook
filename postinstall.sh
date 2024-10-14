#!/bin/bash

# Install Python 3.12 using pyenv
if ! command -v pyenv &> /dev/null
then
    echo "pyenv could not be found, installing..."
    curl https://pyenv.run | bash
    export PATH="$HOME/.pyenv/bin:$PATH"
    eval "$(pyenv init --path)"
    eval "$(pyenv init -)"
    eval "$(pyenv virtualenv-init -)"
fi

pyenv install 3.12.0 -s
pyenv local 3.12.0

# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

echo "Python dependencies installed successfully."