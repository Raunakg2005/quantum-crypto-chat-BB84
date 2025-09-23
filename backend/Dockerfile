FROM python:3.11-slim
WORKDIR /app
COPY requirements-prod.txt ./
RUN pip install --no-cache-dir -r requirements-prod.txt
COPY . /app
ENV PORT=8001
EXPOSE 8001
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
