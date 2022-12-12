import boto3

# AWS S3 연결.
def connection():
    try:
        # s3 클라이언트 생성
        s3 = boto3.client(
            service_name="s3",
            region_name="ap-northeast-2",
            aws_access_key_id="AKIAXDUCX6BNWIKQ3LEC",
            aws_secret_access_key="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",
        )
    except Exception as e:
        print(e)
    else:
        print("s3 bucket connected!")
        return s3