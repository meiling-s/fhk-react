This Jenkins pipeline accepts an AWS account (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) that have ECR repo access permission (like AmazonEC2ContainerRegistryPowerUser).

If such pipeline fails by any reason, you can still perform manual transfer of image from fhkrepo.fhk.app to AWS ECR, like below, with podman/skopeo tool:

[root@ocp4router okd-yaml]# podman login fhkrepo.fhk.app --tls-verify=false
Username: lendus
Password:
Login Succeeded!
[root@ocp4router okd-yaml]# podman pull fhkrepo.fhk.app/astd/account-controller:1-0-0beta-3 --tls-verify=false
Trying to pull fhkrepo.fhk.app/astd/account-controller:1-0-0beta-3...
Getting image source signatures
Copying blob 1baa322208b1 done
Copying blob dc35b837139a done
Copying blob 0c79898df156 done
Copying config 51b17619d9 done
Writing manifest to image destination
Storing signatures
51b17619d93c2f230c57179ed10e9740c788beafd6ef015b39ce06a3942cf690
[root@ocp4router okd-yaml]# podman tag fhkrepo.fhk.app/astd/account-controller:1-0-0beta-3 307426213411.dkr.ecr.ap-east-1.amazonaws.com/astd/account-controller:1-0-0beta-3
[root@ocp4router okd-yaml]# aws configure
AWS Access Key ID [****************FSN7]: (your access key id)
AWS Secret Access Key [****************Iokp]: (your secret access key) 
Default region name [ap-east-1]:
Default output format [json]:
[root@ocp4router okd-yaml]# aws ecr get-login-password | podman login --username AWS --password-stdin 307426213411.dkr.ecr.ap-east-1.amazonaws.com
Login Succeeded!
[root@ocp4router okd-yaml]# podman push 307426213411.dkr.ecr.ap-east-1.amazonaws.com/astd/account-controller:1-0-0beta-3
Getting image source signatures
Copying blob 1053d00b8e29 done
Copying blob 8cf93178ac6d done
Copying blob 57fd8ba2082e done
Copying config 51b17619d9 done
Writing manifest to image destination
Storing signatures
