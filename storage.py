import boto3

ACCESS_KEY = "AKIAXDUCX6BN6DJT5YHR"
SECRET_KEY = "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"

# AWS S3 연결.
def connection():
    try:
        # s3 클라이언트 생성
        s3 = boto3.client(
            service_name="s3",
            region_name="ap-northeast-2",
            aws_access_key_id=ACCESS_KEY,
            aws_secret_access_key=SECRET_KEY
        )
    except Exception as e:
        print(e)
    else:
        print("s3 bucket connected!")
        return s3
