FROM nvidia/cuda:12.1.1-runtime-ubuntu20.04
#set up environment
RUN apt-get update && apt-get install --no-install-recommends --no-install-suggests -y curl
RUN apt-get install unzip
RUN apt-get -y install python3
RUN apt-get -y install python3-pip
RUN apt-get -y install git-lfs
RUN git lfs install
WORKDIR /var/app
# Copy our application code
# . Here means current directory.
COPY . .
# RUN pip3 install --no-cache-dir -r requirements.txt
RUN pip3 install -r requirements.txt
# RUN mkdir model
# RUN cd model
RUN git clone https://huggingface.co/dfurman/falcon-7b-chat-oasst1
# RUN rm -rf /model/.git
RUN cd ..
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
# EXPOSE 3000
# Start the app
# CMD ["gunicorn","app:app"]
CMD ["python","app.py"]
# CMD ["gunicorn", "-b", "0.0.0.0:80","--workers","1","-k","uvicorn.workers.UvicornWorker", "app:wsgi"]